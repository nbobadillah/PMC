package com.pmc.quotestudio.domain;

public enum ServiceType {
    DISENO(30),
    DESARROLLO(40),
    CONSULTORIA(50),
    MARKETING(35),
    FOTOGRAFIA_VIDEO(45);

    private final double baseRate;

    ServiceType(double baseRate) {
        this.baseRate = baseRate;
    }

    public double baseRate() {
        return baseRate;
    }
}

