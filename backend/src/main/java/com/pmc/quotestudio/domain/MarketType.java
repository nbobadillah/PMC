package com.pmc.quotestudio.domain;

public enum MarketType {
    LOCAL(1.0),
    INTERNACIONAL(1.4);

    private final double multiplier;

    MarketType(double multiplier) {
        this.multiplier = multiplier;
    }

    public double multiplier() {
        return multiplier;
    }
}

