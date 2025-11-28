"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactType = exports.ProjectStatus = exports.ProjectRole = exports.UserRole = exports.AgentType = exports.BMadPhase = exports.BMadTrack = void 0;
// BMad v6 Core Types
var BMadTrack;
(function (BMadTrack) {
    BMadTrack["QUICK_FLOW"] = "QUICK_FLOW";
    BMadTrack["BMAD_METHOD"] = "BMAD_METHOD";
    BMadTrack["BROWNFIELD"] = "BROWNFIELD";
})(BMadTrack || (exports.BMadTrack = BMadTrack = {}));
var BMadPhase;
(function (BMadPhase) {
    BMadPhase["ANALYSIS"] = "ANALYSIS";
    BMadPhase["PLANNING"] = "PLANNING";
    BMadPhase["SOLUTIONING"] = "SOLUTIONING";
    BMadPhase["IMPLEMENTATION"] = "IMPLEMENTATION";
})(BMadPhase || (exports.BMadPhase = BMadPhase = {}));
var AgentType;
(function (AgentType) {
    AgentType["ANALYST"] = "ANALYST";
    AgentType["ARCHITECT"] = "ARCHITECT";
    AgentType["PM"] = "PM";
    AgentType["SM"] = "SM";
    AgentType["UX_DESIGNER"] = "UX_DESIGNER";
    AgentType["DEV"] = "DEV";
    AgentType["TEA"] = "TEA";
    AgentType["TECH_WRITER"] = "TECH_WRITER";
})(AgentType || (exports.AgentType = AgentType = {}));
// User & Authentication Types
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["PROJECT_MANAGER"] = "PROJECT_MANAGER";
    UserRole["STAKEHOLDER"] = "STAKEHOLDER";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["OWNER"] = "OWNER";
    ProjectRole["ADMIN"] = "ADMIN";
    ProjectRole["MEMBER"] = "MEMBER";
    ProjectRole["VIEWER"] = "VIEWER";
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
// Project Types
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "DRAFT";
    ProjectStatus["ACTIVE"] = "ACTIVE";
    ProjectStatus["ON_HOLD"] = "ON_HOLD";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["ARCHIVED"] = "ARCHIVED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
// Artifact Types
var ArtifactType;
(function (ArtifactType) {
    ArtifactType["PROJECT_BRIEF"] = "PROJECT_BRIEF";
    ArtifactType["PRD"] = "PRD";
    ArtifactType["ARCHITECTURE"] = "ARCHITECTURE";
    ArtifactType["USER_STORIES"] = "USER_STORIES";
    ArtifactType["TEST_PLAN"] = "TEST_PLAN";
    ArtifactType["MARKET_RESEARCH"] = "MARKET_RESEARCH";
    ArtifactType["BUSINESS_CASE"] = "BUSINESS_CASE";
    ArtifactType["TRAINING_MATERIAL"] = "TRAINING_MATERIAL";
})(ArtifactType || (exports.ArtifactType = ArtifactType = {}));
//# sourceMappingURL=index.js.map