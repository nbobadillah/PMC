package com.pmc.quotestudio.auth;

import com.pmc.quotestudio.domain.RoleType;

public record SessionUser(
        String name,
        String email,
        RoleType role,
        String dashboardTitle,
        String dashboardSubtitle
) {
}
