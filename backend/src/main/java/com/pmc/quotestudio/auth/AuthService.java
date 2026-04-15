package com.pmc.quotestudio.auth;

import com.pmc.quotestudio.domain.RoleType;
import com.pmc.quotestudio.dto.LoginRequest;
import com.pmc.quotestudio.dto.LoginResponse;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final Map<String, DemoUser> demoUsers = Map.of(
            "freelancer@pricepilot.app", new DemoUser(
                    "Ana Freelancer",
                    "freelancer@pricepilot.app",
                    "demo123",
                    RoleType.FREELANCER,
                    "Panel independiente",
                    "Calcula cuanto cobrar, protege tu margen y prepara propuestas mas solidas."
            ),
            "empresa@pricepilot.app", new DemoUser(
                    "Carlos Empresa",
                    "empresa@pricepilot.app",
                    "demo123",
                    RoleType.EMPRESA,
                    "Panel empresa",
                    "Estima cuanto pagar, sueldo mensual y costo real de contratacion."
            )
    );

    private final Map<String, SessionUser> activeSessions = new ConcurrentHashMap<>();

    public LoginResponse login(LoginRequest request) {
        DemoUser user = demoUsers.get(request.email().trim().toLowerCase());
        if (user == null || !user.password().equals(request.password()) || user.role() != request.role()) {
            throw new IllegalArgumentException("Credenciales invalidas para el perfil seleccionado");
        }

        String token = UUID.randomUUID().toString();
        SessionUser sessionUser = new SessionUser(
                user.name(),
                user.email(),
                user.role(),
                user.dashboardTitle(),
                user.dashboardSubtitle()
        );
        activeSessions.put(token, sessionUser);

        return new LoginResponse(
                token,
                sessionUser.name(),
                sessionUser.email(),
                sessionUser.role(),
                sessionUser.dashboardTitle(),
                sessionUser.dashboardSubtitle()
        );
    }

    public SessionUser requireSession(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Sesion requerida");
        }

        SessionUser sessionUser = activeSessions.get(token);
        if (sessionUser == null) {
            throw new IllegalArgumentException("Sesion invalida o expirada");
        }
        return sessionUser;
    }

    public void logout(String token) {
        if (token != null && !token.isBlank()) {
            activeSessions.remove(token);
        }
    }

    private record DemoUser(
            String name,
            String email,
            String password,
            RoleType role,
            String dashboardTitle,
            String dashboardSubtitle
    ) {
    }
}
