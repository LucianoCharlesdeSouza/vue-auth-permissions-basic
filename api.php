<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$secretKey        = 'secret';
$refreshSecretKey = 'refresh-secret';

// Simular um banco de dados de usuários
$users = [
    'souzacomprog@gmail.com' => [
        'password'           => '1234',
        'permissions'        => ['dashboard', 'users']
    ],
    'robson@gmail.com' => [
        'password'     => '1234',
        'permissions'  => ['dashboard']
    ]
];


function generateJWT($email, $permissions, $secretKey, $expiresIn = 3600)
{
    $header  = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode([
        'email'       => $email,
        'permissions' => $permissions,
        'exp'        => time() + $expiresIn
    ]));

    $signature = hash_hmac('sha256', "$header.$payload", $secretKey, true);
    $signature = base64_encode($signature);

    return "$header.$payload.$signature";
}

function validateJWT($token, $secretKey)
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$header, $payload, $signature] = $parts;
    $validSignature = base64_encode(hash_hmac('sha256', "$header.$payload", $secretKey, true));

    if ($validSignature !== $signature) {
        return null;
    }

    $payload = json_decode(base64_decode($payload), true);

    if ($payload['exp'] < time()) {
        return null;
    }

    return $payload;
}

function tokenIsValid($secretKey)
{
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Token não fornecido']);
        exit;
    }

    $token = $matches[1];

    $payload = validateJWT($token, $secretKey);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Token inválido ou expirado']);
        exit;
    }

    return $payload;
}

$uri    = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Rota de login
if ($method === 'POST' && $uri === '/api.php/login') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Email e senha são obrigatórios']);
        exit;
    }

    $email    = $data['email'];
    $password = $data['password'];

    if (!isset($users[$email]) || $users[$email]['password'] !== $password) {
        http_response_code(422);
        echo json_encode(['error' => 'Credenciais inválidas']);
        exit;
    }

    // Gerar access token 
    $accessToken = generateJWT($email, $users[$email]['permissions'], $secretKey, 30);

    // Gerar refresh token (expira em 7 dias)
    $refreshToken = generateJWT($email, $users[$email]['permissions'], $refreshSecretKey, 604800);

    echo json_encode([
        'token'        => $accessToken,
        'refreshToken' => $refreshToken,
        'user'         => $email,
        'permissions'  => $users[$email]['permissions']
    ]);
    exit;
}

// rota para refresh token
if ($method === 'POST' && $uri === '/api.php/refresh') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['refreshToken'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Refresh token é obrigatório']);
        exit;
    }

    $payload = validateJWT($data['refreshToken'], $refreshSecretKey);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Refresh token inválido ou expirado']);
        exit;
    }

    $email = $payload['email'];

    // Gerar novo access token
    $newAccessToken = generateJWT($email, $users[$email]['permissions'], $secretKey, 30);

    echo json_encode([
        'token'       => $newAccessToken,
        'user'        => $email,
        'permissions' => $users[$email]['permissions']
    ]);
    exit;
}


if ($method === 'GET' && $uri === '/api.php/me') {

    $payload = tokenIsValid($secretKey);

    echo json_encode([
        'user'         => $payload['email'],
        'permissions'  => $users[$payload['email']]['permissions']
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Rota não encontrada']);
exit;
