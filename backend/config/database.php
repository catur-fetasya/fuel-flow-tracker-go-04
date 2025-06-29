
<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'fuel_transport_tracker';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}

// JWT Helper functions
function generateJWT($userId, $role) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $userId,
        'role' => $role,
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]);

    $headerEncoded = base64url_encode($header);
    $payloadEncoded = base64url_encode($payload);

    $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, 'your-secret-key', true);
    $signatureEncoded = base64url_encode($signature);

    return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
}

function verifyJWT($jwt) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return false;
    }

    $header = base64url_decode($parts[0]);
    $payload = base64url_decode($parts[1]);
    $signature = base64url_decode($parts[2]);

    $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], 'your-secret-key', true);

    if (!hash_equals($signature, $expectedSignature)) {
        return false;
    }

    $payloadData = json_decode($payload, true);
    if ($payloadData['exp'] < time()) {
        return false;
    }

    return $payloadData;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

function getCurrentUser() {
    $headers = getallheaders();
    $token = null;

    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }

    if (!$token) {
        return null;
    }

    return verifyJWT($token);
}
?>
