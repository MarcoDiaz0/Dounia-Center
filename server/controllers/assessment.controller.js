import Assessment from '../models/Assessment.model.js';
import Child from '../models/Child.model.js';

// Get all assessments for parent
export const getAssessments = async (req, res) => {
  try {
    const { childId, status, type, page = 1, limit = 10 } = req.query;

    const query = { parent: req.user.id };
    if (childId) query.child = childId;
    if (status) query.status = status;
    if (type) query.type = type;

    const assessments = await Assessment.find(query)
      .populate('child', 'firstName lastName dateOfBirth')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Assessment.countDocuments(query);

    res.json({
      success: true,
      data: {
        assessments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments',
      error: error.message
    });
  }
};

// Get assessment by ID
export const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      parent: req.user.id
    })
      .populate('child', 'firstName lastName dateOfBirth gender')
      .populate('recommendations.resources');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      data: { assessment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment',
      error: error.message
    });
  }
};

// Create new assessment
export const createAssessment = async (req, res) => {
  try {
    const { childId, type, answers } = req.body;

    // Verify child belongs to parent
    const child = await Child.findOne({
      _id: childId,
      parent: req.user.id
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    // Calculate child age at assessment
    const age = child.age;

    const assessment = await Assessment.create({
      child: childId,
      parent: req.user.id,
      type: type || 'initial',
      status: answers && answers.length > 0 ? 'in_progress' : 'draft',
      childAgeAtAssessment: {
        years: age.years,
        months: age.months
      },
      answers: answers || []
    });

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: { assessment }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create assessment',
      error: error.message
    });
  }
};

// Update assessment (add answers)
export const updateAssessment = async (req, res) => {
  try {
    const { answers, status } = req.body;

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      parent: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Don't allow updating completed assessments
    if (assessment.status === 'completed' || assessment.status === 'reviewed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a completed assessment'
      });
    }

    if (answers) {
      assessment.answers = answers;
    }

    if (status) {
      assessment.status = status;
      if (status === 'completed') {
        assessment.completedAt = new Date();
      }
    }

    await assessment.save();

    // If completed, update child's developmental scores
    if (assessment.status === 'completed') {
      await Child.findByIdAndUpdate(assessment.child, {
        developmentalScores: {
          cognitive: assessment.results.cognitive,
          motor: assessment.results.motor,
          language: assessment.results.language,
          socialEmotional: assessment.results.socialEmotional
        }
      });
    }

    res.json({
      success: true,
      message: 'Assessment updated successfully',
      data: { assessment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update assessment',
      error: error.message
    });
  }
};

// Submit assessment for completion
export const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      parent: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    if (assessment.status === 'completed' || assessment.status === 'reviewed') {
      return res.status(400).json({
        success: false,
        message: 'Assessment already completed'
      });
    }

    // Update answers and complete
    assessment.answers = answers;
    assessment.status = 'completed';
    assessment.completedAt = new Date();

    // Generate recommendations based on results
    const recommendations = generateRecommendations(assessment.results);
    assessment.recommendations = recommendations;

    await assessment.save();

    // Update child's developmental scores
    await Child.findByIdAndUpdate(assessment.child, {
      developmentalScores: {
        cognitive: assessment.results.cognitive,
        motor: assessment.results.motor,
        language: assessment.results.language,
        socialEmotional: assessment.results.socialEmotional
      }
    });

    res.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: { assessment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit assessment',
      error: error.message
    });
  }
};

// Generate recommendations helper
function generateRecommendations(results) {
  const recommendations = [];

  if (results.cognitive < 70) {
    recommendations.push({
      category: 'cognitive',
      title: 'Cognitive Development Activities',
      description: 'Engage in puzzle-solving, memory games, and problem-solving activities to enhance cognitive skills.',
      priority: results.cognitive < 50 ? 'high' : 'medium'
    });
  }

  if (results.motor < 70) {
    recommendations.push({
      category: 'motor',
      title: 'Motor Skills Development',
      description: 'Practice fine and gross motor activities like drawing, cutting, jumping, and ball games.',
      priority: results.motor < 50 ? 'high' : 'medium'
    });
  }

  if (results.language < 70) {
    recommendations.push({
      category: 'language',
      title: 'Language & Communication',
      description: 'Read together daily, practice storytelling, and engage in conversation to boost language skills.',
      priority: results.language < 50 ? 'high' : 'medium'
    });
  }

  if (results.socialEmotional < 70) {
    recommendations.push({
      category: 'social',
      title: 'Social-Emotional Development',
      description: 'Encourage playdates, practice expressing emotions, and model positive social interactions.',
      priority: results.socialEmotional < 50 ? 'high' : 'medium'
    });
  }

  return recommendations;
}

// Delete assessment
export const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOneAndDelete({
      _id: req.params.id,
      parent: req.user.id,
      status: { $in: ['draft', 'in_progress'] }
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found or cannot be deleted'
      });
    }

    res.json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete assessment',
      error: error.message
    });
  }
};
