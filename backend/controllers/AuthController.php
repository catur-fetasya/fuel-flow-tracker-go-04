
<?php
require_once 'config/database.php';

class AuthController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        try {
            $query = "SELECT * FROM profiles WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $data->email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($data->password, $user['password'])) {
                $token = generateJWT($user['id'], $user['role']);
                
                echo json_encode([
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user['name'],
                        'role' => $user['role']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password) || !isset($data->name) || !isset($data->role)) {
            http_response_code(400);
            echo json_encode(['error' => 'All fields are required']);
            return;
        }

        try {
            // Check if user already exists
            $query = "SELECT id FROM profiles WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $data->email);
            $stmt->execute();

            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'User already exists']);
                return;
            }

            // Create new user
            $id = uniqid();
            $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

            $query = "INSERT INTO profiles (id, email, name, role, password, created_at) 
                      VALUES (:id, :email, :name, :role, :password, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':email', $data->email);
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':role', $data->role);
            $stmt->bindParam(':password', $hashedPassword);

            if ($stmt->execute()) {
                $token = generateJWT($id, $data->role);
                
                echo json_encode([
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $id,
                        'email' => $data->email,
                        'name' => $data->name,
                        'role' => $data->role
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create user']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
