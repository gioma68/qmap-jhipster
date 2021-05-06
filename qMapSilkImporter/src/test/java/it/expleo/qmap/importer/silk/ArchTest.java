package it.expleo.qmap.importer.silk;

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
            .importPackages("it.expleo.qmap.importer.silk");

        noClasses()
            .that()
            .resideInAnyPackage("it.expleo.qmap.importer.silk.service..")
            .or()
            .resideInAnyPackage("it.expleo.qmap.importer.silk.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..it.expleo.qmap.importer.silk.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
