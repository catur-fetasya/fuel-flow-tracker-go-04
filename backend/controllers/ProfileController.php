
<?php
require_once 'config/database.php';

class ProfileController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getProfile($id) {
        $user = getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            $query = "SELECT id, email, name, role, created_at FROM profiles WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $profile = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($profile) {
                echo json_encode($profile);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Profile not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getAllProfiles() {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        try {
            $query = "SELECT id, email, name, role, created_at FROM profiles ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($profiles);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createProfile() {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password) || !isset($data->name) || !isset($data->role)) {
            http_response_code(400);
            echo json_encode(['error' => 'All fields are required']);
            return;
        }

        try {
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
                echo json_encode([
                    'success' => true,
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

    public function updateProfile($id) {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->name) || !isset($data->role)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email, name and role are required']);
            return;
        }

        try {
            // Check if profile exists
            $checkQuery = "SELECT id FROM profiles WHERE id = :id";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Profile not found']);
                return;
            }

            // Update profile
            if (isset($data->password) && !empty($data->password)) {
                $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
                $query = "UPDATE profiles SET email = :email, name = :name, role = :role, password = :password, updated_at = NOW() WHERE id = :id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':password', $hashedPassword);
            } else {
                $query = "UPDATE profiles SET email = :email, name = :name, role = :role, updated_at = NOW() WHERE id = :id";
                $stmt = $this->conn->prepare($query);
            }

            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':email', $data->email);
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':role', $data->role);

            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $id,
                        'email' => $data->email,
                        'name' => $data->name,
                        'role' => $data->role
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update user']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function deleteProfile($id) {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        try {
            // Check if profile exists
            $checkQuery = "SELECT id FROM profiles WHERE id = :id";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Profile not found']);
                return;
            }

            // Delete profile
            $query = "DELETE FROM profiles WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete user']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
