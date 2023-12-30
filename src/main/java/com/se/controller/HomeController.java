package com.se.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.se.entity.Customer;
import com.se.service.CustomerService;
import com.se.service.MailerService;

@Controller
public class HomeController {
	@Autowired
	CustomerService Cservice;
	@Autowired
	HttpServletRequest req;
	@Autowired
	BCryptPasswordEncoder pe;
	@Autowired
	MailerService mailer;
	@RequestMapping({ "/admin", "/admin/home/index" })
	public String admin(Model model) {
		String maKH = req.getRemoteUser();
		Customer item = Cservice.FindCustomeṛ̣̣̣ById(maKH);
		Boolean flag = req.isUserInRole("ADMIN");
		String role = "ADMIN";
		if (flag) {
			model.addAttribute("quyen", role);
		} else {
			role = "STAF";
			model.addAttribute("quyen", role);
		}
		model.addAttribute("acc", item);

		return "../static/admin/layout_admin";
	}
	/*
	 * @RequestMapping({ "/home" }) public String home(Model model) {
	 * 
	 * return "../static/admin/layout_admin"; }
	 */
	@RequestMapping("/user/sign-in")
	public String login(Model model) {
		model.addAttribute("message", "Vui lòng đăng nhập!");
		return "users/sign-in";
	}
	@RequestMapping("/user/sign-in/success")
	public String loginSuccess(Model model) {
		model.addAttribute("message", "Đăng nhập thành công!");
		return "/user/home";
	}
	@RequestMapping("/user/sign-in/erro")
	public String loginErro(Model model) {
		return "redirect:/user/sign-in";
	}
	@RequestMapping("/user/logoff/success")
	public String logoff(Model model) {
		return "redirect:/user/home";
	}
	@RequestMapping("/user/sign-up")
	public String signup(Model model) {
		return "users/sign-up";
	}
	@RequestMapping({"/user/home","/"})
	public String home(Model model) {
		return "users/index";
	}
	@RequestMapping("/user/unauthoried")
	public String unauthoried(Model model) {
		return "redirect:/user/home";
	}
}
