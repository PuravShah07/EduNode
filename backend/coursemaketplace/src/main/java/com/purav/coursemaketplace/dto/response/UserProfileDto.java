package com.purav.coursemaketplace.dto.response;

import com.purav.coursemaketplace.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
