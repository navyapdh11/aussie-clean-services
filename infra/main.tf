terraform {
  required_version = ">= 1.0"
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

variable "vercel_token" {
  description = "Vercel API Token"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "GitHub Personal Access Token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Vercel Project Name"
  type        = string
  default     = "aussie-clean-services"
}

provider "vercel" {
  token = var.vercel_token
}

resource "vercel_project" "this" {
  name = var.project_name
}

resource "vercel_project_settings" "this" {
  project_id = vercel_project.this.id
  
  framework         = "express"
  build_command     = "npm run build"
  output_directory  = "."
  
  environment_variables = [
    {
      key   = "NODE_ENV"
      value = "production"
      target = ["production"]
    },
    {
      key   = "VERCEL"
      value = "1"
      target = ["production"]
    }
  ]
}

resource "vercel_deployment" "this" {
  project_id = vercel_project.this.id
  
  files = [
    for f in fileset(path.module, "**/*") :
    {
      path = f
      mode = "file"
    }
  ]
  
  deploy_settings {
    production    = true
    serverless_function_region = "syd1"
  }
  
  depends_on = [vercel_project_settings.this]
}

output "deployment_url" {
  value = vercel_deployment.this.url
}

output "project_url" {
  value = "https://${vercel_project.this.name}.vercel.app"
}