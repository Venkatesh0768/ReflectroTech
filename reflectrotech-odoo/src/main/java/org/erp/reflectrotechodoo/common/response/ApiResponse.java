package org.erp.reflectrotechodoo.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Single, consistent API response envelope used across ALL controllers.
 *
 * <pre>
 * {
 *   "success": true,
 *   "message": "Customer created successfully",
 *   "data": { ... },
 *   "errors": null,
 *   "timestamp": "2024-01-01T00:00:00"
 * }
 * </pre>
 *
 * {@code @JsonInclude(NON_NULL)} suppresses null fields in JSON output so
 * error-free responses don't carry an empty {@code errors} array and vice versa.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final List<String> errors;

    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    // ──────────────────────────────────────────────────────────────────────────
    // Static factory helpers — keeps controllers single-line clean
    // ──────────────────────────────────────────────────────────────────────────

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(String message, List<String> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
