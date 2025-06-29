
<?php
require_once 'config/database.php';

class UnitController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getAllUnits() {
        $user = getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            $query = "SELECT * FROM units ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $units = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($units);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createUnit() {
        $user = getCurrentUser();
        if (!$user || !in_array($user['role'], ['admin', 'pengawas_transportir'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->nomor_unit) || !isset($data->driver_name)) {
            http_response_code(400);
            echo json_encode(['error' => 'Unit number and driver name are required']);
            return;
        }

        try {
            $id = uniqid();
            $pengawas_id = $user['user_id'];

            $query = "INSERT INTO units (id, nomor_unit, driver_name, driver_id, pengawas_id, created_at, updated_at) 
                      VALUES (:id, :nomor_unit, :driver_name, :driver_id, :pengawas_id, NOW(), NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':nomor_unit', $data->nomor_unit);
            $stmt->bindParam(':driver_name', $data->driver_name);
            $stmt->bindParam(':driver_id', $data->driver_id ?? null);
            $stmt->bindParam(':pengawas_id', $pengawas_id);

            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'unit' => [
                        'id' => $id,
                        'nomor_unit' => $data->nomor_unit,
                        'driver_name' => $data->driver_name,
                        'driver_id' => $data->driver_id ?? null,
                        'pengawas_id' => $pengawas_id
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create unit']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
