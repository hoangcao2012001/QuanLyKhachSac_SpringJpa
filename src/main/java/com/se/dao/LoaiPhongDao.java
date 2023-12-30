package com.se.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.se.entity.LoaiPhong;


public interface LoaiPhongDao extends JpaRepository<LoaiPhong, Integer> {
	@Query("SELECT lp FROM LoaiPhong lp WHERE lp.isDisable = false")
	public List<LoaiPhong> findAllWhereDisableFlase();
}
