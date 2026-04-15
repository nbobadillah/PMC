package com.pmc.quotestudio.dto;

import com.pmc.quotestudio.domain.RoleType;

public record LoginResponse(
        String token,
        String name,
        String email,
        RoleType role,
        String dashboardTitle,
        String dashboardSubtitle
) {
}
