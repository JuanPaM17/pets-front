package com.spring.pets.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class HomeController {

	@GetMapping("/")
	public ModelAndView showHomePage(HttpServletRequest request, HttpServletResponse response, Model model) {
		return showLoginPage(request, response, model);
	}

	@GetMapping("/login")
	public ModelAndView showLoginPage(HttpServletRequest request, HttpServletResponse response, Model model) {
		return new ModelAndView("login", "pageId", "login");
	}

	@GetMapping("/mascotas")
	public ModelAndView showMascotaPage(HttpServletRequest request, HttpServletResponse response, Model model) {
		return new ModelAndView("mascota", "pageId", "mascotas");
	}

	@GetMapping("/clientes")
	public ModelAndView showClientePage(HttpServletRequest request, HttpServletResponse response, Model model) {
		return new ModelAndView("cliente", "pageId", "clientes");
	}

	@GetMapping("/medicamentos")
	public ModelAndView showMedicamentoPage(HttpServletRequest request, HttpServletResponse response, Model model) {
		return new ModelAndView("medicamento", "pageId", "medicamentos");
	}

	@GetMapping("/reportes")
	public ModelAndView showReportePage(HttpServletRequest request, HttpServletResponse response, Model model) {
		model.addAttribute("pageIdDetail", "detail");
		return new ModelAndView("reporte", "pageId", "reportes");
	}

}
