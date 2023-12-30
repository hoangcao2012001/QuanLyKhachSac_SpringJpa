package com.se.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.se.entity.DichVu;




public interface DichVuDao extends JpaRepository<DichVu, Integer> {
	@Query("SELECT dv FROM DichVu dv WHERE dv.isDisable = false")
	public List<DichVu> findAllWhereDisableFlase();
}
