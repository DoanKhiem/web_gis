<?php
    include 'connection.php';
?>
<?php
    if (isset($_GET['ten_vung'])) {
    	$ten_vung = $_GET['ten_vung'];
    	$name = strtolower($ten_vung);
    	$query = "SELECT *, st_x(ST_Centroid(geom)) AS x, st_y(ST_Centroid(geom)) AS y FROM public.camhoangdc WHERE LOWER(txtmemo) LIKE '%$name%'";
    	$result = pg_query($conn, $query);
    	$tong_so_ket_qua = pg_num_rows($result);
        // var_dump($tong_so_ket_qua);die();
        if ($tong_so_ket_qua > 0) {
            while ($dong = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $link = "<a href='javascript:void(0);' class='xem' onClick='di_den_diem(".$dong['x'].",".$dong['y'].");'>";
                $link1 = "</a>";
                print($link."Loại đất: ".$dong["txtmemo"]." | Diện tích: ".$dong['shape_area']." " .$link1. "</br>");
            }
        } else {
            print("<span class='xem'>Không có kết quả</span>");
        }
    } else {
    	echo "<span class='xem'>Không có kết quả</span>";
    }

?>