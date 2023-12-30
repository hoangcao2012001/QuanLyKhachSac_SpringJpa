package com.se.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.se.entity.Promotion;


public interface PromotionDao extends JpaRepository<Promotion, String>{
	@Query("SELECT pr FROM Promotion pr WHERE pr.isDisable = false")
	public List<Promotion> findAllWhereDisableFlase();
}
