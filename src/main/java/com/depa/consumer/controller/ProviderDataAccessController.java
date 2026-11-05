package com.depa.consumer.controller;

import com.depa.consumer.dto.DataExchangeRequest;
import com.depa.consumer.dto.DataExchangeResponse;
import com.depa.consumer.service.AuthorizedDataService;
import com.depa.consumer.client.DiffieHellmanUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.KeyPair;
import java.security.PublicKey;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
public class ProviderDataAccessController {

    private final AuthorizedDataService authorizedDataService;
    private final com.depa.consumer.client.ConsentManagerClient consentManagerClient;

    public ProviderDataAccessController(AuthorizedDataService authorizedDataService,
                                        com.depa.consumer.client.ConsentManagerClient consentManagerClient) {
        this.authorizedDataService = authorizedDataService;
        this.consentManagerClient = consentManagerClient;
    }

    @PostMapping("/access/{grantId}")
    public ResponseEntity<?> getAuthorizedData(
            @PathVariable("grantId") String grantId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody DataExchangeRequest exchangeRequest
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized", "message", "Missing or invalid Bearer Authorization header"));
        }

        String accessJwt = authHeader.substring(7).trim();

        try {
            Map<String, Object> data = authorizedDataService.fetchAuthorizedData(grantId, accessJwt);
            
            // Generate Provider's DH KeyPair
            KeyPair providerKeyPair = DiffieHellmanUtil.generateKeyPair();
            String providerPublicKeyBase64 = DiffieHellmanUtil.encodePublicKey(providerKeyPair.getPublic());
            
            // Decode Consumer's Public Key
            PublicKey consumerPubKey = DiffieHellmanUtil.decodePublicKey(exchangeRequest.getConsumerPublicKey());
            
            // Generate Shared Secret
            byte[] sharedSecret = DiffieHellmanUtil.generateSharedSecret(providerKeyPair.getPrivate(), consumerPubKey);
            
            // Serialize data
            ObjectMapper mapper = new ObjectMapper();
            String plainTextData = mapper.writeValueAsString(data);
            
            // Encrypt data
            String encryptedData = DiffieHellmanUtil.encrypt(plainTextData, sharedSecret);
            
            // Asynchronously report data flow to CM for student audit and notification traceability
            String studentId = data.containsKey("STUDENT_ID") ? (String) data.get("STUDENT_ID") : (String) data.get("principalId");
            consentManagerClient.reportDataFlowEvent(
                    grantId,
                    studentId,
                    "DATA_PREPARED_AND_SHARED",
                    "COLLEGE_B",
                    new java.util.ArrayList<>(data.keySet()),
                    "Provider College B encrypted and released authorized fields for GrantId=" + grantId
            );

            DataExchangeResponse response = new DataExchangeResponse();
            response.setProviderPublicKey(providerPublicKeyBase64);
            response.setEncryptedData(encryptedData);
            
            return ResponseEntity.ok(response);
            
        } catch (io.jsonwebtoken.JwtException | SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Forbidden", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Error", "message", e.getMessage()));
        }
    }
}
