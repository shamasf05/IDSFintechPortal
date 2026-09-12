CREATE DATABASE idsfintechportal;
USE IDSFintechPortal;

CREATE TABLE Roles (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Email VARCHAR(200) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,
    Status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ApprovedAt DATETIME NULL,
    ApprovedBy INT NULL,

    CONSTRAINT FK_Users_Roles
        FOREIGN KEY (RoleId)
        REFERENCES Roles(Id)
);

CREATE TABLE Products (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Description VARCHAR(1000),
    BusinessPurpose VARCHAR(1000),
    LifecycleStatus VARCHAR(50) NOT NULL,
    CurrentVersion VARCHAR(50),
    SupportedMarkets VARCHAR(500),
    Criticality VARCHAR(50),
    Technologies VARCHAR(500),
    Notes VARCHAR(1000),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL
);

CREATE TABLE Modules (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    Name VARCHAR(150) NOT NULL,
    Description VARCHAR(500),
    Status VARCHAR(50),

    CONSTRAINT FK_Modules_Products
        FOREIGN KEY (ProductId)
        REFERENCES Products(Id)
);

CREATE TABLE Clients (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CompanyName VARCHAR(200) NOT NULL,
    Country VARCHAR(100),
    ContactInformation VARCHAR(500),
    Status VARCHAR(50),
    Notes VARCHAR(1000),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Deployments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ClientId INT NOT NULL,
    ProductId INT NOT NULL,
    ProductVersion VARCHAR(50),
    GoLiveDate DATE,
    DeploymentStatus VARCHAR(50),
    SupportTier VARCHAR(50),
    ClientSpecificNotes VARCHAR(1000),

    CONSTRAINT FK_Deployments_Clients
        FOREIGN KEY (ClientId)
        REFERENCES Clients(Id),

    CONSTRAINT FK_Deployments_Products
        FOREIGN KEY (ProductId)
        REFERENCES Products(Id)
);

CREATE TABLE DeploymentModules (
    DeploymentId INT NOT NULL,
    ModuleId INT NOT NULL,

    PRIMARY KEY (DeploymentId, ModuleId),

    CONSTRAINT FK_DeploymentModules_Deployments
        FOREIGN KEY (DeploymentId)
        REFERENCES Deployments(Id),

    CONSTRAINT FK_DeploymentModules_Modules
        FOREIGN KEY (ModuleId)
        REFERENCES Modules(Id)
);

CREATE TABLE Environments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DeploymentId INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    EnvironmentType VARCHAR(50),
    Purpose VARCHAR(500),
    ServerName VARCHAR(200),
    OperatingSystem VARCHAR(100),
    ApplicationUrl VARCHAR(500),
    DatabaseInformation VARCHAR(500),
    MonitoringLink VARCHAR(500),
    AccessInstructions VARCHAR(500),
    Notes VARCHAR(1000),

    CONSTRAINT FK_Environments_Deployments
        FOREIGN KEY (DeploymentId)
        REFERENCES Deployments(Id)
);

CREATE TABLE TeamMembers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(150) NOT NULL,
    JobTitle VARCHAR(100),
    Department VARCHAR(100),
    Email VARCHAR(200),
    Status VARCHAR(50)
);

CREATE TABLE ProductResponsibilities (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    TeamMemberId INT NOT NULL,
    Responsibility VARCHAR(100),
    Description VARCHAR(500),

    CONSTRAINT FK_ProductResponsibilities_Products
        FOREIGN KEY (ProductId)
        REFERENCES Products(Id),

);
ALTER TABLE ProductResponsibilities
ADD CONSTRAINT FK_ProductResponsibilities_Users
FOREIGN KEY (TeamMemberId)
REFERENCES Users(Id);

CREATE TABLE Repositories (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    Name VARCHAR(150) NOT NULL,
    GithubUrl VARCHAR(500),
    MainBranch VARCHAR(100),
    Description VARCHAR(500),

    CONSTRAINT FK_Repositories_Products
        FOREIGN KEY (ProductId)
        REFERENCES Products(Id)
);

CREATE TABLE Documents (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    Name VARCHAR(200) NOT NULL,
    DocumentType VARCHAR(100),
    Description VARCHAR(500),
    Url VARCHAR(500),
    LastUpdatedDate DATE,

    CONSTRAINT FK_Documents_Products
        FOREIGN KEY (ProductId)
        REFERENCES Products(Id)
);