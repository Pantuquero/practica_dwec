<?php
header('Access-Control-Allow-Origin: *');
/* Database connection information */
include("mysql.php" );


/*
 * Local functions
 */

function fatal_error($sErrorMessage = '') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}

/*
 * MySQL connection
 */
if (!$gaSql['link'] = mysql_pconnect($gaSql['server'], $gaSql['user'], $gaSql['password'])) {
    fatal_error('Could not open connection to server');
}

if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}

mysql_query('SET names utf8');
//$_REQUEST['id_doctor'] = 1;
if (isset($_REQUEST['id_doctor'])) {
    // param was set in the query string
    if (empty($_REQUEST['id_doctor'])) {
        return "El parámetro id_doctor viene vacio!";
    }
    $id_doctor = $_REQUEST['id_doctor'];
}

/*
 * SQL queries
 * Get data to display
 */
$query0 = "delete from clinica_doctor where id_doctor=" . $id_doctor;
$query0_res = mysql_query($query0);
if (!$query0_res) {
    $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
    $estado = mysql_errno();
    // Comprobar el resultado
    } else {
        $query = "delete from doctores where id_doctor=" . $id_doctor;
        $query_res = mysql_query($query);
        if (!$query_res) {
        if (mysql_errno() == 1451) {
            $mensaje = "Imposible borrar este doctor, tiene otras dependencias. Borre estas dependencias primero";
            $estado = mysql_errno();
        } else {
            $mensaje = "Actualización correcta";
            $estado = 0;
        }
        
    }

}

$resultado = array();
$resultado[] = array(
    'mensaje' => $mensaje,
    'estado' => $estado
);
echo json_encode($resultado);
?>
