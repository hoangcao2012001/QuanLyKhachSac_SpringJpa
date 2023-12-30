package com.se.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.se.entity.OrderDichVu;

public interface OrderDichVuDao extends JpaRepository<OrderDichVu, Integer> {
	@Query("SELECT o FROM OrderDichVu o WHERE o.maDatPhong.maDatPhong = ?1")
	public List<OrderDichVu> FindALLOrderByMaDP(int id) ;
}
