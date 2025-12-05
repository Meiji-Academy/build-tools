plugins {
    `kotlin-dsl`
    `java-gradle-plugin`
    `maven-publish`
    id("com.gradle.plugin-publish") version "1.2.1"
}

group = "com.meijiacademy.build"
version = "1.0.0"

repositories {
    mavenCentral()
    gradlePluginPortal()
}

dependencies {
    implementation(gradleApi())
    implementation(localGroovy())
}

gradlePlugin {
    website.set("https://github.com/meiji-academy/build-tools")
    vcsUrl.set("https://github.com/meiji-academy/build-tools")

    plugins {
        create("buildTools") {
            id = "com.meijiacademy.build.tools"
            implementationClass = "com.meijiacademy.build.EnvironmentCheckPlugin"

            displayName = "Meiji Academy Build Tools"
            description = "Shared build utilities and environment checks for Meiji Academy projects."

            tags.set(listOf("build-tools", "environment", "check", "ci", "meiji-academy"))
        }
    }
}