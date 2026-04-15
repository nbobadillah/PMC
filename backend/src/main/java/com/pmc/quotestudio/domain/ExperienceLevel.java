package com.pmc.quotestudio.domain;

public enum ExperienceLevel {
    JUNIOR(0.8, "0-1 anos"),
    SEMI_SENIOR(1.0, "2-4 anos"),
    SENIOR(1.3, "5+ anos");

    private final double multiplier;
    private final String label;

    ExperienceLevel(double multiplier, String label) {
        this.multiplier = multiplier;
        this.label = label;
    }

    public double multiplier() {
        return multiplier;
    }

    public String label() {
        return label;
    }
}

