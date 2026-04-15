package com.pmc.quotestudio.controller;

import com.pmc.quotestudio.auth.AuthService;
import com.pmc.quotestudio.auth.SessionUser;
import com.pmc.quotestudio.dto.QuoteRequest;
import com.pmc.quotestudio.dto.QuoteResponse;
import com.pmc.quotestudio.service.QuoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class QuoteController {

    private final QuoteService quoteService;
    private final AuthService authService;

    public QuoteController(QuoteService quoteService, AuthService authService) {
        this.quoteService = quoteService;
        this.authService = authService;
    }

    @GetMapping("/health")
    public String health() {
        return "ok";
    }

    @PostMapping("/quotes")
    @ResponseStatus(HttpStatus.OK)
    public QuoteResponse createQuote(
            @RequestHeader("X-Auth-Token") String token,
            @Valid @RequestBody QuoteRequest request
    ) {
        SessionUser sessionUser = authService.requireSession(token);
        if (sessionUser.role() != request.role()) {
            throw new IllegalArgumentException("El perfil autenticado no coincide con la cotizacion enviada");
        }
        return quoteService.calculate(request);
    }
}
