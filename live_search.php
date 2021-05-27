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
                $link = "<a href='javascript:void(0);' onClick='di_den_diem(".$dong['x'].",".$dong['y'].");'>xem</a>";
                print("Hiện trạng sử dụng: ".$dong["txtmemo"]."| Diện tích: ".$dong['shape_area']." " .$link. "</br>");
            }
        } else {
            print("Không có kết quả");
        }
    } else {
    	echo "Không có kết quả";
    }

?>