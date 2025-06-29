
<?php
// Database installation script
require_once 'config/database.php';

echo "<h2>Database Installation Script</h2>";

try {
    // Connect to MySQL server (without specifying database)
    $pdo = new PDO("mysql:host=localhost", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Read and execute the schema.sql file
    $sql = file_get_contents('database/schema.sql');
    
    // Split SQL into individual statements
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo "<p style='color: green;'>✅ Database 'fuel_transport_tracker' created successfully!</p>";
    echo "<p style='color: green;'>✅ All tables created successfully!</p>";
    echo "<p style='color: green;'>✅ Dummy data inserted successfully!</p>";
    
    echo "<h3>Test Users:</h3>";
    echo "<ul>";
    echo "<li><strong>Admin:</strong> admin@fuel.com / admin123</li>";
    echo "<li><strong>Driver:</strong> driver@fuel.com / driver123</li>";
    echo "<li><strong>Fuelman:</strong> fuelman@fuel.com / fuelman123</li>";
    echo "<li><strong>Pengawas:</strong> pengawas@fuel.com / pengawas123</li>";
    echo "<li><strong>Depo:</strong> depo@fuel.com / depo123</li>";
    echo "<li><strong>GL PAMA:</strong> gl@fuel.com / gl123</li>";
    echo "</ul>";
    
    echo "<p><a href='index.php'>Go to API</a></p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
