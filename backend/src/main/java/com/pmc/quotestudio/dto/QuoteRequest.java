package com.pmc.quotestudio.dto;

import com.pmc.quotestudio.domain.ComplexityLevel;
import com.pmc.quotestudio.domain.ExperienceLevel;
import com.pmc.quotestudio.domain.MarketType;
import com.pmc.quotestudio.domain.RoleType;
import com.pmc.quotestudio.domain.ServiceType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record QuoteRequest(
        @NotNull RoleType role,
        @NotNull ServiceType service,
        @NotNull ExperienceLevel experience,
        @NotNull ComplexityLevel complexity,
        @NotNull MarketType market,
        @NotNull @Min(1) @Max(500) Integer hours,
        @NotNull @Min(0) @Max(10) Integer revisions,
        @NotNull @Min(0) @Max(80) Integer overheadPercent,
        @NotNull @Min(0) @Max(40) Integer contingencyPercent,
        @NotNull @Min(200) @Max(100000) Integer monthlyIncomeGoal,
        @NotNull @Min(10) @Max(240) Integer monthlyBillableHours,
        @NotNull Boolean rushDelivery
) {
}
