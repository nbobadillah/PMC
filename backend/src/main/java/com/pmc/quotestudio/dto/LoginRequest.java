package com.pmc.quotestudio.dto;

import com.pmc.quotestudio.domain.RoleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotNull RoleType role,
        @NotBlank String email,
        @NotBlank String password
) {
}
