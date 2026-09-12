
using System.Text;
using IDSFintech.Api.Data;
using IDSFintech.Api.Repositories;
using IDSFintech.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var jwt = builder.Configuration.GetSection("Jwt");

var key = jwt["Key"]
    ?? throw new InvalidOperationException("Jwt:Key is required.");

builder.Services.AddControllers();

builder.Services.AddCors(x =>
    x.AddDefaultPolicy(p =>
        p.WithOrigins("http://localhost:5173")
         .AllowAnyHeader()
         .AllowAnyMethod()
    )
);

builder.Services.AddScoped<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IPortalRepository, PortalRepository>();
builder.Services.AddScoped<EnvironmentRepository>();

builder.Services.AddSingleton<JwtService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(x =>
        x.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(key)
                )
        }
    );

builder.Services.AddAuthorization();

// Product Responsibilities
builder.Services.AddScoped<ProductResponsibilityRepository>();
builder.Services.AddScoped<ProductResponsibilityService>();

// Deployment Modules
builder.Services.AddScoped<DeploymentModuleRepository>();
builder.Services.AddScoped<DeploymentModuleService>();

// Team Members
builder.Services.AddScoped<TeamMemberRepository>();
builder.Services.AddScoped<TeamMemberService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

