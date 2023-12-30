package com.se.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.se.entity.Roles;




public interface RolesDao extends JpaRepository<Roles, String> {
	@Query("select r from Roles r where id = User ")
	Roles findRole();
}

