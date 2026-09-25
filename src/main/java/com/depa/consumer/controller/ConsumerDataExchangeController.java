package com.depa.consumer.controller;

import com.depa.consumer.client.ProviderDataClient;
import com.depa.consumer.dto.DirectDataAccessRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/consumer")
public class ConsumerDataExchangeController {

    private final ProviderDataClient providerDataClient;

    public ConsumerDataExchangeController(ProviderDataClient providerDataClient) {
        this.providerDataClient = providerDataClient;
    }

    /**
     * Endpoint for College B Consumer system to directly fetch authorized data from Provider.
     * Demonstrates that College B executes direct peer-to-peer data access using the CM-issued Access Token.
     */
    @PostMapping("/fetch-direct-data")
    public ResponseEntity<?> fetchDirectDataFromProvider(@RequestBody DirectDataAccessRequest request) {
        if (request.getGrantId() == null || request.getAccessToken() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", "grantId and accessToken are required"));
        }

        try {
            ResponseEntity<Map<String, Object>> response = providerDataClient.fetchAuthorizedDataFromProvider(
                    request.getGrantId(),
                    request.getAccessToken()
            );
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("error", "Direct Access Failed", "message", e.getMessage()));
        }
    }
}
