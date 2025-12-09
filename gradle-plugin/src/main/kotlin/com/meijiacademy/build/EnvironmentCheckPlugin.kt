package com.meijiacademy.build

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.api.GradleException

class EnvironmentCheckPlugin : Plugin<Project> {

    override fun apply(project: Project) {
        project.gradle.taskGraph.whenReady {
            validateEnvironment(project)
        }
    }

    private fun validateEnvironment(project: Project) {
        if (isCI()) {
            validateCIEnvironment()
        } else {
            validateLocalEnvironment(project)
        }
    }

    private fun isCI(): Boolean {
        return System.getenv("CI") != null || System.getenv("GITHUB_ACTIONS") != null
    }

    private fun validateCIEnvironment() {
        if (System.getenv("MEIJI_ACADEMY_PACKAGES_TOKEN").isNullOrEmpty()) {
            throw GradleException("Build Failed: MEIJI_ACADEMY_PACKAGES_TOKEN environment variable is missing in CI.")
        }
    }

    private fun validateLocalEnvironment(project: Project) {
        val user = project.findProperty("gpr.user")?.toString()
        val key = project.findProperty("gpr.key")?.toString()

        if (user.isNullOrEmpty() || key.isNullOrEmpty()) {
            printLocalSetupInstructions()
            throw GradleException("Build Failed: Missing GitHub Packages credentials in gradle.properties.")
        }
    }

    private fun printLocalSetupInstructions() {
        val red = "\u001B[31m"
        val bold = "\u001B[1m"
        val reset = "\u001B[0m"

        println("""
            $red
            ╔════════════════════════════════════════════════════════════════╗
            ║               ⚠️  ENVIRONMENT CHECK FAILED  ⚠️                 ║
            ╠════════════════════════════════════════════════════════════════╣
            ║                                                                ║
            ║  $bold Missing GitHub Credentials! $reset $red                                   ║
            ║                                                                ║
            ║  1. Generate a token (read:packages):                          ║
            ║     https://github.com/settings/tokens                         ║
            ║                                                                ║
            ║  2. Add to ~/.gradle/gradle.properties:                        ║
            ║     gpr.user=YOUR_USERNAME                                     ║
            ║     gpr.key=YOUR_TOKEN                                         ║
            ║                                                                ║
            ╚════════════════════════════════════════════════════════════════╝
            $reset
        """.trimIndent())
    }
}