package com.purav.coursemaketplace.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RecentActivityDto {
    private String type;
    private String message;
    private LocalDateTime timestamp;
}
