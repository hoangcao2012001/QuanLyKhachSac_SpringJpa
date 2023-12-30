package com.se.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.se.entity.DatPhong;



public interface DatPhongDao  extends JpaRepository<DatPhong, Integer> {
	@Query("SELECT d FROM DatPhong d WHERE d.trangThai = true")
	List<DatPhong> findDPByFalseWhereTrangThaiTrue();
	@Query("SELECT d FROM DatPhong d WHERE d.maKhachHang.maKhachHang = ?1 AND d.trangThai = true")
	List<DatPhong> findDPByMaKHAndTrangThai(String maKH);
	@Query("SELECT d FROM DatPhong d WHERE d.maPhong.maPhong = ?1"
			+"  and (d.ngayBD between ?2 and ?3 or d.ngayKT between ?2 and ?3)"
			+ " and d.trangThai = true")
	List<DatPhong> checkDPByNgayBDAndNgayKT(String maPhong, Date ngayBD , Date ngayKT);
//	public DatPhong FindDatPhongById(int theId);
//	public DatPhong FindDatPhongByKhachHangId(String maKhachHang);
//	public DatPhong FindDatPhongBySoCC(String SoCC);
}