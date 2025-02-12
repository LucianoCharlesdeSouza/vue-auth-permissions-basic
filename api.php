<?php
header("Access-Control-Allow-Origin: http://localhost:8080"); // URL do seu frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Importante para cookies!
header('Content-Type: application/json');
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

date_default_timezone_set('America/Sao_Paulo');


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

function cookieIsValid($secretKey)
{
    $access_token = $_COOKIE['access_token'] ?? null;

    if (!$access_token) {
        http_response_code(401);
        echo json_encode(['error' => 'Cookie não encontrado']);
        exit;
    }

    $payload = validateJWT($access_token, $secretKey);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Access Token inválido ou expirado']);
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

    // Gerar tokens
    $accessToken  = generateJWT($email, $users[$email]['permissions'], $secretKey, 30);
    $refreshToken = generateJWT($email, $users[$email]['permissions'], $refreshSecretKey, 60);

    // Configurar cookies HTTP-only
    setcookie('access_token', $accessToken, [
        'expires' => time() + 30,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    setcookie('refresh_token', $refreshToken, [
        'expires' => time() + 60,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    echo json_encode([
        'user' => $email,
        'permissions' => $users[$email]['permissions']
    ]);
    exit;
}

//rota de logout
if ($method === 'POST' && $uri === '/api.php/logout') {
    // Remover cookies
    setcookie('access_token', '', [
        'expires' => 1,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    setcookie('refresh_token', '', [
        'expires' => 1,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    echo json_encode(['message' => 'Logout realizado com sucesso']);
    exit;
}


// rota para refresh token
if ($method === 'POST' && $uri === '/api.php/refresh') {

    $refreshToken = $_COOKIE['refresh_token'] ?? null;

    if (!$refreshToken) {
        http_response_code(401);
        echo json_encode(['error' => 'Cookie Refresh token não encontrado']);
        exit;
    }

    $payload = validateJWT($refreshToken, $refreshSecretKey);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Refresh token inválido ou expirado']);
        exit;
    }

    $email = $payload['email'];

    // Gerar novo access token
    $newAccessToken = generateJWT($email, $users[$email]['permissions'], $secretKey, 30);

    // Configurar novo cookie
    setcookie('access_token', $newAccessToken, [
        'expires' => time() + 30,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    echo json_encode([
        'user' => $email,
        'permissions' => $users[$email]['permissions']
    ]);
    exit;
}




if ($method === 'GET' && $uri === '/api.php/me') {

    $payload = cookieIsValid($secretKey);

    echo json_encode([
        'user'         => $payload['email'],
        'permissions'  => $users[$payload['email']]['permissions']
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Rota não encontrada']);
exit;
