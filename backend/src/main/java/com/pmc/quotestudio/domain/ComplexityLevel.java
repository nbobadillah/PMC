package com.pmc.quotestudio.domain;

public enum ComplexityLevel {
    BAJA(1.0),
    MEDIA(1.2),
    ALTA(1.5);

    private final double multiplier;

    ComplexityLevel(double multiplier) {
        this.multiplier = multiplier;
    }

    public double multiplier() {
        return multiplier;
    }
}

