package com.pmc.quotestudio.dto;

import java.util.Map;

public record QuoteResponse(
        double lowHourlyRate,
        double highHourlyRate,
        double centralHourlyRate,
        double totalLowBudget,
        double totalRecommendedBudget,
        double totalHighBudget,
        int hours,
        double sustainableHourlyFloor,
        int recommendedDepositPercent,
        double recommendedDepositAmount,
        String riskLevel,
        double estimatedMonthlySalary,
        double estimatedMonthlyCompanyCost,
        String currency,
        String negotiationScript,
        String executiveSummary,
        String hiringRecommendation,
        String scopeRecommendation,
        Map<String, Double> multipliers,
        Map<String, Double> packageBudgets
) {
}
