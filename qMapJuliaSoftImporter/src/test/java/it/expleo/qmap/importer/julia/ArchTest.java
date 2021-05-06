package it.expleo.qmap.importer.julia;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("it.expleo.qmap.importer.julia");

        noClasses()
            .that()
            .resideInAnyPackage("it.expleo.qmap.importer.julia.service..")
            .or()
            .resideInAnyPackage("it.expleo.qmap.importer.julia.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..it.expleo.qmap.importer.julia.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
