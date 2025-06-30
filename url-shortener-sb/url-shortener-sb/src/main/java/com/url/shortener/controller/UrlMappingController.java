package com.url.shortener.controller;

import com.url.shortener.dtos.ClickEventDto;
import com.url.shortener.models.User;
import com.url.shortener.services.UrlMappingService;
import com.url.shortener.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.url.shortener.dtos.UrlMappingDTO;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
public class UrlMappingController {
    @Autowired
    private UrlMappingService urlMappingService;

    @Autowired
    private UserService userService;


    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> createShortUrl(@RequestBody Map<String, String> request, Principal principal){
        String originalUrl = request.get("originalUrl");
        User user = userService.findByUsername(principal.getName());
        UrlMappingDTO urlMappingDTO =  urlMappingService.createShortUrl(originalUrl, user);
        return ResponseEntity.ok(urlMappingDTO);
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDto>> getUrlAnalytics(@PathVariable String shortUrl,
                                                               @RequestParam("startDate") String startDate,
                                                               @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        return ResponseEntity.ok(urlMappingService.getClickEventsByDate(shortUrl, start, end));
    }

    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicksByDate(Principal principal,
                                                          @RequestParam("startDate") String startDate,
                                                          @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        User user = userService.findByUsername(principal.getName());
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        return ResponseEntity.ok(urlMappingService.getTotalClicksByUserAndDate(user, start, end));
    }

    @GetMapping("/myUrls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getUserUrls(Principal principal){
        System.out.println("getUserUrls called with principal: " + (principal != null ? principal.getName() : "null"));
        User user = userService.findByUsername(principal.getName());
        System.out.println("Found user: " + (user != null ? user.getUsername() : "null"));
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);
        System.out.println("Found " + urls.size() + " URLs for user");
        return ResponseEntity.ok(urls);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("Controller is working!");
    }
}
