const Department = require('../db/Department');

/**
 * Create new department
 */
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, designations } = req.body;
    const newDepartment = new Department({
      name,
      description,
      designations
    });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add department' });
  }
};

/**
 * Get all departments
 */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

/**
 * Get specific department
 */
exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

/**
 * Update department
 */
exports.updateDepartment = async (req, res) => {
  try {
    const { name, description, designations } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, designations },
      { new: true }
    );
    if (!updatedDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
};

/**
 * Delete department
 */
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (department) {
      res.json({ message: 'Department deleted successfully' });
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

/**
 * Get designations for specific department
 */
exports.getDepartmentDesignations = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (department) {
      res.json(department.designations);
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
};

/**
 * Update specific designation in department
 */
exports.updateDesignation = async (req, res) => {
  const { departmentId } = req.params;
  const { oldDesignation, newDesignation } = req.body;

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const designationIndex = department.designations.indexOf(oldDesignation);
    if (designationIndex === -1) {
      return res.status(404).json({ message: 'Designation not found' });
    }

    department.designations[designationIndex] = newDesignation;
    await department.save();

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update designation', error });
  }
};
