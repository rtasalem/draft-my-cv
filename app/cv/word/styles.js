import { AlignmentType } from 'docx'

export const styles = {
  paragraphStyles: [
    {
      id: 'sectionTitle',
      name: 'Section Title',
      basedOn: 'Normal',
      nest: 'Normal',
      run: {
        size: 28,
        bold: true,
        font: 'Times New Roman'
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 240,
          after: 120
        }
      }
    },
    {
      id: 'Header',
      name: 'Header Name',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: 36,
        bold: true,
        font: 'Times New Roman'
      },
      paragraph: {
        alignment: AlignmentType.CENTER
      }
    },
    {
      id: 'contactInformation',
      name: 'Contact Information',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: 22,
        font: 'Times New Roman'
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200
        }
      }
    },
    {
      id: 'entryTitle',
      name: 'Entry Title',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: 22,
        font: 'Times New Roman'
      }
    },
    {
      id: 'entryText',
      name: 'Entry Text',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: 22,
        font: 'Times New Roman'
      }
    }
  ]
}
