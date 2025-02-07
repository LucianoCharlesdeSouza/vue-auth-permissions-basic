<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$secretKey = 'secret';

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

// Função para criar um token JWT(simulação). Não use isso em produção!
function generateJWT($email, $permissions, $secretKey)
{
    $header  = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode([
        'email'      => $email,
        'permissions' => $permissions,
        'exp'         => time() + (60 * 60)
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

$uri    = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

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

    $token = generateJWT($email, $users[$email]['permissions'], $secretKey);

    echo json_encode([
        'token'       => $token,
        'user'        => $email,
        'permissions' => $users[$email]['permissions']
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Rota não encontrada']);
exit;
