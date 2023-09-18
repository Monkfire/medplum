import { getElementDefinitionTypeName, getPropertyDisplayName, isReference, isResource } from './types';

describe('Type Utils', () => {
  test('getPropertyDisplayName', () => {
    expect(getPropertyDisplayName('Patient.id')).toEqual('ID');
    expect(getPropertyDisplayName('Patient.name')).toEqual('Name');
    expect(getPropertyDisplayName('Patient.birthDate')).toEqual('Birth Date');
    expect(getPropertyDisplayName('DeviceDefinition.manufacturer[x]')).toEqual('Manufacturer');
    expect(getPropertyDisplayName('ClientApplication.jwksUri')).toEqual('JWKS URI');
    expect(getPropertyDisplayName('ClientApplication.redirectUri')).toEqual('Redirect URI');
  });

  test('getElementDefinitionTypeName', () => {
    expect(getElementDefinitionTypeName({ type: [{ code: 'string' }] })).toEqual('string');
    expect(getElementDefinitionTypeName({ path: 'Patient.address', type: [{ code: 'Address' }] })).toEqual('Address');
    expect(getElementDefinitionTypeName({ path: 'Patient.contact', type: [{ code: 'BackboneElement' }] })).toEqual(
      'PatientContact'
    );
    expect(getElementDefinitionTypeName({ path: 'Timing.repeat', type: [{ code: 'Element' }] })).toEqual(
      'TimingRepeat'
    );

    // There is an important special case for ElementDefinition with contentReference
    // In the original StructureDefinition, contentReference is used to point to another ElementDefinition
    // In StructureDefinitionParser.peek(), we merge the referenced ElementDefinition into the current one
    // In that case, ElementDefinition.path will be the original, but ElementDefinition.base.path will be the referenced.
    expect(
      getElementDefinitionTypeName({
        path: 'Questionnaire.item.item',
        base: { path: 'Questionnaire.item' },
        type: [{ code: 'Element' }],
      })
    ).toEqual('QuestionnaireItem');
  });

  test('isResource', () => {
    expect(isResource(undefined)).toBe(false);
    expect(isResource(null)).toBe(false);
    expect(isResource('Patient')).toBe(false);
    expect(isResource({})).toBe(false);
    expect(isResource({ resourceType: 'Patient' })).toBe(true);
    expect(isResource({ reference: 'Patient/123' })).toBe(false);
  });

  test('isReference', () => {
    expect(isReference(undefined)).toBe(false);
    expect(isReference(null)).toBe(false);
    expect(isReference('Patient')).toBe(false);
    expect(isReference({})).toBe(false);
    expect(isReference({ resourceType: 'Patient' })).toBe(false);
    expect(isReference({ reference: 'Patient/123' })).toBe(true);
  });
});
