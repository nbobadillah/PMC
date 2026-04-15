package com.pmc.quotestudio.service;

import com.pmc.quotestudio.domain.RoleType;
import com.pmc.quotestudio.dto.QuoteRequest;
import com.pmc.quotestudio.dto.QuoteResponse;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class QuoteService {

    public QuoteResponse calculate(QuoteRequest request) {
        double baseRate = request.service().baseRate();
        double experienceMultiplier = request.experience().multiplier();
        double complexityMultiplier = request.complexity().multiplier();
        double marketMultiplier = request.market().multiplier();
        double revisionsMultiplier = calculateRevisionsMultiplier(request.revisions());
        double overheadMultiplier = 1 + (request.overheadPercent() / 100.0);
        double contingencyMultiplier = 1 + (request.contingencyPercent() / 100.0);
        double rushMultiplier = request.rushDelivery() ? 1.18 : 1.0;
        double sustainableHourlyFloor = round(request.monthlyIncomeGoal() / (double) request.monthlyBillableHours());

        double marketDrivenHourly = round(baseRate * experienceMultiplier * complexityMultiplier * marketMultiplier);
        double protectedBaseHourly = Math.max(marketDrivenHourly, sustainableHourlyFloor);
        double centralHourly = round(
                protectedBaseHourly
                        * revisionsMultiplier
                        * overheadMultiplier
                        * contingencyMultiplier
                        * rushMultiplier
        );
        double lowHourly = round(centralHourly * 0.9);
        double highHourly = round(centralHourly * 1.14);
        double totalLow = round(lowHourly * request.hours());
        double totalRecommended = round(centralHourly * request.hours());
        double totalHigh = round(highHourly * request.hours());
        int recommendedDepositPercent = calculateDepositPercent(request);
        double recommendedDepositAmount = round(totalRecommended * (recommendedDepositPercent / 100.0));
        String riskLevel = calculateRiskLevel(request);
        double estimatedMonthlySalary = round(centralHourly * request.monthlyBillableHours());
        double estimatedMonthlyCompanyCost = round(estimatedMonthlySalary * 1.35);

        Map<String, Double> multipliers = new LinkedHashMap<>();
        multipliers.put("baseRate", baseRate);
        multipliers.put("experience", experienceMultiplier);
        multipliers.put("complexity", complexityMultiplier);
        multipliers.put("market", marketMultiplier);
        multipliers.put("revisions", revisionsMultiplier);
        multipliers.put("overhead", overheadMultiplier);
        multipliers.put("contingency", contingencyMultiplier);
        multipliers.put("rush", rushMultiplier);
        multipliers.put("sustainableFloor", sustainableHourlyFloor);

        Map<String, Double> packageBudgets = new LinkedHashMap<>();
        packageBudgets.put("base", totalLow);
        packageBudgets.put("recommended", totalRecommended);
        packageBudgets.put("premium", round(totalHigh * 1.12));

        return new QuoteResponse(
                lowHourly,
                highHourly,
                centralHourly,
                totalLow,
                totalRecommended,
                totalHigh,
                request.hours(),
                sustainableHourlyFloor,
                recommendedDepositPercent,
                recommendedDepositAmount,
                riskLevel,
                estimatedMonthlySalary,
                estimatedMonthlyCompanyCost,
                "USD",
                buildNegotiationScript(request, lowHourly, highHourly, recommendedDepositPercent),
                buildExecutiveSummary(request.role(), sustainableHourlyFloor, marketDrivenHourly),
                buildHiringRecommendation(request.role(), estimatedMonthlySalary, estimatedMonthlyCompanyCost),
                buildScopeRecommendation(request),
                multipliers,
                packageBudgets
        );
    }

    private double calculateRevisionsMultiplier(int revisions) {
        if (revisions <= 2) {
            return 1.0;
        }
        return 1 + ((revisions - 2) * 0.04);
    }

    private int calculateDepositPercent(QuoteRequest request) {
        int basePercent = request.role() == RoleType.EMPRESA ? 30 : 40;
        if (request.rushDelivery()) {
            basePercent += 10;
        }
        if (request.market().multiplier() > 1.0) {
            basePercent += 10;
        }
        return Math.min(basePercent, 60);
    }

    private String calculateRiskLevel(QuoteRequest request) {
        int score = 0;
        if (request.complexity().multiplier() >= 1.5) {
            score++;
        }
        if (request.market().multiplier() > 1.0) {
            score++;
        }
        if (request.rushDelivery()) {
            score++;
        }
        if (request.revisions() >= 4) {
            score++;
        }

        if (score >= 3) {
            return "ALTO";
        }
        if (score == 2) {
            return "MEDIO";
        }
        return "CONTROLADO";
    }

    private String buildNegotiationScript(QuoteRequest request, double low, double high, int depositPercent) {
        if (request.role() == RoleType.EMPRESA) {
            return "Para este perfil y contexto, el rango razonable de contratacion se ubica entre "
                    + low + " y " + high + " USD por hora. "
                    + "La recomendacion ya contempla complejidad, costos operativos y un margen de contingencia. "
                    + "Si se requiere acelerar el proceso, conviene reservar al menos un "
                    + depositPercent + "% del presupuesto y cerrar cuanto antes alcance, disponibilidad y entregables esperados.";
        }

        return "Con base en el servicio seleccionado, el nivel de experiencia, la complejidad y el mercado, "
                + "la tarifa recomendada para este proyecto se encuentra entre "
                + low + " y " + high + " USD por hora. "
                + "Este rango ya considera revisiones, costos operativos y un margen de contingencia razonable. "
                + "Para reducir riesgo de caja, conviene solicitar un anticipo del "
                + depositPercent + "% y dejar por escrito alcance, entregables y numero de revisiones. "
                + "Si el presupuesto necesita ajuste, se recomienda renegociar alcance, iteraciones o cronograma antes que recortar la tarifa por hora.";
    }

    private String buildExecutiveSummary(RoleType roleType, double sustainableFloor, double marketDrivenHourly) {
        if (roleType == RoleType.EMPRESA) {
            return "Referencia para presupuestar con consistencia, reducir friccion comercial y alinear expectativas con el perfil requerido. "
                    + "La tarifa sugerida protege un piso sostenible de " + sustainableFloor + " USD/h frente a una referencia de mercado de "
                    + marketDrivenHourly + " USD/h.";
        }
        return "Referencia para defender la tarifa con criterio comercial y presentar una propuesta profesional al cliente. "
                + "La recomendacion evita cotizar por debajo del piso sostenible de " + sustainableFloor + " USD/h.";
    }

    private String buildScopeRecommendation(QuoteRequest request) {
        if (request.role() == RoleType.EMPRESA) {
            if (request.rushDelivery()) {
                return "Definir fecha de ingreso, prioridades del rol y responsables de aprobacion reduce errores de contratacion cuando la necesidad es urgente.";
            }
            if (request.complexity().multiplier() >= 1.5) {
                return "Conviene documentar responsabilidades, stack esperado y criterios de desempeno para evitar sobrepago o desalineacion con el perfil buscado.";
            }
            return "Un brief claro del rol, alcance mensual y expectativas de resultados mejora la precision del presupuesto y acelera la decision.";
        }

        if (request.rushDelivery()) {
            return "Conviene trabajar con hitos semanales, aprobaciones rapidas y limite explicito de cambios para proteger la entrega urgente.";
        }
        if (request.revisions() >= 4) {
            return "El proyecto necesita una clausula clara de control de cambios; a partir de la tercera revision es razonable cobrar extras.";
        }
        if (request.complexity().multiplier() >= 1.5) {
            return "Documenta entregables, supuestos tecnicos y dependencias del cliente para reducir desviaciones en un proyecto de alta complejidad.";
        }
        return "Mantener alcance, fechas y criterios de aprobacion por escrito ayuda a sostener la tarifa y evitar retrabajo.";
    }

    private String buildHiringRecommendation(RoleType roleType, double estimatedMonthlySalary, double estimatedMonthlyCompanyCost) {
        if (roleType == RoleType.EMPRESA) {
            return "Para una contratacion recurrente, un sueldo de referencia cercano a " + estimatedMonthlySalary
                    + " USD/mes puede ser razonable. Considerando cargas, herramientas y gestion, el presupuesto empresa deberia acercarse a "
                    + estimatedMonthlyCompanyCost + " USD/mes.";
        }

        return "Si el cliente propone mensualizar la relacion, una referencia sana estaria cerca de "
                + estimatedMonthlySalary + " USD/mes para que la tarifa por proyecto no destruya tu margen.";
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
