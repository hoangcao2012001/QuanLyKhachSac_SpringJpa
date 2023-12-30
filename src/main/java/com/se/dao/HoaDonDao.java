package com.se.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.se.entity.HoaDon;






public interface HoaDonDao   extends JpaRepository<HoaDon, Integer> {
	@Query("SELECT d FROM HoaDon d WHERE d.trangThai = false")
	List<HoaDon> findHDByFalse();
	@Query("SELECT d FROM HoaDon d WHERE d.trangThai = true")
	List<HoaDon> findHDByTrue();
	@Query("SELECT d FROM HoaDon d WHERE d.ngayThanhToan = ?1 and d.trangThai = true")
	List<HoaDon> findHDByNgayThanhToan(Date ngay);
}