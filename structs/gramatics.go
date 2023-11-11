package structs

import "time"

type GrammaticalRule struct {
	ID          int       // Unique identifier for the rule
	Name        string    // A descriptive name for the rule
	Description string    // Explanation of the rule
	Example     string    // An example sentence illustrating the rule
	Category    string    // The category or type of the rule (e.g., syntax, morphology)
	Language    string    // The specific language or dialect the rule applies to
	Source      string    // The source or reference for the rule (e.g., book, author)
	Users       []string  //Users who modified this
	CreatedAt   time.Time // Timestamp when the rule was added to the registry
	UpdatedAt   time.Time // Timestamp when the rule was last updated
}
