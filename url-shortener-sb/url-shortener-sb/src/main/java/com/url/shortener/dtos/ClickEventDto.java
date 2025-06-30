package com.url.shortener.dtos;

import java.time.LocalDate;

public class ClickEventDto {
    private Long count;
    private LocalDate clickDate;

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public LocalDate getClickDate() {
        return clickDate;
    }

    public void setClickDate(LocalDate clickDate) {
        this.clickDate = clickDate;
    }
}
