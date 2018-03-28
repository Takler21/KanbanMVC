
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 09/27/2017 12:55:50
-- Generated from EDMX file: C:\Users\iazpiroz-ext\documents\visual studio 2015\Projects\Angular2DB\Angular2DB\DBContext\UserDBEntities.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [UserDB];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_Id_Depart]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[TblUser] DROP CONSTRAINT [FK_Id_Depart];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[TblUser]', 'U') IS NOT NULL
    DROP TABLE [dbo].[TblUser];
GO
IF OBJECT_ID(N'[dbo].[TblDepartment]', 'U') IS NOT NULL
    DROP TABLE [dbo].[TblDepartment];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'TblUser'
CREATE TABLE [dbo].[TblUser] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [FirstName] nvarchar(250)  NULL,
    [LastName] nvarchar(250)  NULL,
    [Gender] nvarchar(250)  NULL,
    [Id_Depart] int  NULL
);
GO

-- Creating table 'TblDepartment'
CREATE TABLE [dbo].[TblDepartment] (
    [Id] int  NOT NULL,
    [NameDepart] varchar(50)  NULL,
    [Sales] int  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'TblUser'
ALTER TABLE [dbo].[TblUser]
ADD CONSTRAINT [PK_TblUser]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'TblDepartment'
ALTER TABLE [dbo].[TblDepartment]
ADD CONSTRAINT [PK_TblDepartment]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [Id_Depart] in table 'TblUser'
ALTER TABLE [dbo].[TblUser]
ADD CONSTRAINT [FK_TblDepartmentTblUser]
    FOREIGN KEY ([Id_Depart])
    REFERENCES [dbo].[TblDepartment]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_TblDepartmentTblUser'
CREATE INDEX [IX_FK_TblDepartmentTblUser]
ON [dbo].[TblUser]
    ([Id_Depart]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------