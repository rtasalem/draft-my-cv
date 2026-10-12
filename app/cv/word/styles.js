import { AlignmentType, BorderStyle, LevelFormat } from 'docx'

// Values taken from the Harvard bullet template (2025), in twips unless noted.
export const page = {
  size: { width: 12240, height: 15840 },
  margin: { top: 720, bottom: 280, left: 600, right: 600 }
}

export const textWidth = page.size.width - page.margin.left - page.margin.right

// Size is in eighths of a point; space is in points.
export const nameRule = { style: BorderStyle.SINGLE, size: 8, color: 'auto', space: 1 }

export const linkColour = '0563C1'

export const styles = {
  default: {
    document: {
      run: { font: 'Arial', size: 22 }
    }
  },
  paragraphStyles: [
    {
      id: 'name',
      name: 'CV Name',
      basedOn: 'Normal',
      next: 'Normal',
      run: { bold: true },
      paragraph: { alignment: AlignmentType.CENTER }
    },
    {
      id: 'contact',
      name: 'CV Contact',
      basedOn: 'Normal',
      next: 'Normal',
      paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 170 } }
    },
    {
      id: 'sectionTitle',
      name: 'CV Section Title',
      basedOn: 'Normal',
      next: 'Normal',
      run: { bold: true },
      paragraph: { alignment: AlignmentType.CENTER }
    },
    {
      id: 'entry',
      name: 'CV Entry',
      basedOn: 'Normal',
      next: 'Normal',
      paragraph: { indent: { left: 120 } }
    }
  ]
}

export const numbering = {
  config: [
    {
      reference: 'bullet',
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 840, hanging: 360 } } }
        }
      ]
    }
  ]
}
