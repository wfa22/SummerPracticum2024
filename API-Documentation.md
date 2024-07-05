# HH Parser API Documentation

## Overview
This document provides the details of the HH Parser API, which is designed to parse vacancies from hh.ru.

### Version
- **Title:** HH Parser API
- **Version:** 1.0.0
- **Description:** API for parsing vacancies from hh.ru

## Endpoints

### 1. List Areas
- **Endpoint:** `/api/areas/`
- **Method:** GET
- **Operation ID:** `areas_list`
- **Tags:** `areas`
- **Security:**
  - `cookieAuth`
  - `basicAuth`
- **Responses:**
  - **200:** 
    - **Content-Type:** `application/json`
    - **Schema:**
      - **Type:** array
      - **Items:** `$ref: '#/components/schemas/Area'`

### 2. Create Parse
- **Endpoint:** `/api/parse/`
- **Method:** POST
- **Operation ID:** `parse_create`
- **Tags:** `parse`
- **Request Body:**
  - **Content-Type:** `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
  - **Schema:** `$ref: '#/components/schemas/VacancyParse'`
- **Security:**
  - `cookieAuth`
  - `basicAuth`
- **Responses:**
  - **200:**
    - **Content-Type:** `application/json`
    - **Schema:** `$ref: '#/components/schemas/VacancyParse'`

### 3. Retrieve Schema
- **Endpoint:** `/api/schema/`
- **Method:** GET
- **Operation ID:** `schema_retrieve`
- **Description:** OpenAPI3 schema for this API. Format can be selected via content negotiation.
  - **YAML:** `application/vnd.oai.openapi`
  - **JSON:** `application/vnd.oai.openapi+json`
- **Parameters:**
  - **Query Parameters:**
    - **format:**
      - **Type:** string
      - **Enum:** `json`, `yaml`
    - **lang:**
      - **Type:** string
      - **Enum:** `af`, `ar`, `ar-dz`, `ast`, `az`, `be`, `bg`, `bn`, `br`, `bs`, `ca`, `ckb`, `cs`, `cy`, `da`

## Components

### Schemas

#### Area
- **Type:** object
- **Properties:**
  - **id:**
    - **Type:** integer
  - **name:**
    - **Type:** string

#### VacancyParse
- **Type:** object
- **Properties:**
  - **text:**
    - **Type:** string
  - **area:**
    - **Type:** integer
  - **salary_from:**
    - **Type:** integer
    - **Nullable:** true
  - **salary_to:**
    - **Type:** integer
    - **Nullable:** true
  - **employment:**
    - **Nullable:** true
    - **OneOf:**
      - `$ref: '#/components/schemas/EmploymentEnum'`
      - `$ref: '#/components/schemas/BlankEnum'`
      - `$ref: '#/components/schemas/NullEnum'`
  - **schedule:**
    - **Nullable:** true
    - **OneOf:**
      - `$ref: '#/components/schemas/ScheduleEnum'`
      - `$ref: '#/components/schemas/BlankEnum'`
      - `$ref: '#/components/schemas/NullEnum'`
  - **experience:**
    - **Nullable:** true
    - **OneOf:**
      - `$ref: '#/components/schemas/ExperienceEnum'`
      - `$ref: '#/components/schemas/BlankEnum'`
      - `$ref: '#/components/schemas/NullEnum'`
  - **education:**
    - **Nullable:** true
    - **OneOf:**
      - `$ref: '#/components/schemas/EducationEnum'`
      - `$ref: '#/components/schemas/BlankEnum'`
      - `$ref: '#/components/schemas/NullEnum'`

### Security Schemes
- **basicAuth:**
  - **Type:** http
  - **Scheme:** basic
- **cookieAuth:**
  - **Type:** apiKey
  - **In:** cookie
  - **Name:** sessionid

## Enums

### EmploymentEnum
- **Type:** string
- **Enum:** `full-time`, `part-time`, `project`, `volunteer`, `internship`

### ScheduleEnum
- **Type:** string
- **Enum:** `full-day`, `shift`, `flexible`, `remote`, `fly-in-fly-out`

### ExperienceEnum
- **Type:** string
- **Enum:** `noExperience`, `between1And3`, `between3And6`, `moreThan6`

### EducationEnum
- **Type:** string
- **Enum:** `secondary`, `specialSecondary`, `higher`, `bachelor`, `master`, `phd`

### BlankEnum
- **Type:** string
- **Enum:** `''`

### NullEnum
- **Type:** string
- **Enum:** `null`

